import { json } from "express";
import fetch from "node-fetch";

class ContactController {
  constructor() {
    this.baseURL = "https://arsenavdalyan.amocrm.ru/api/v4/contacts";
    this.authToken =
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImMwOTY2ZGZhODhmMzQyMzdmMzhmYzI5YzA1ODlmYjc5ZjM3MjljNjBjM2JjNmQ0ODI1Yzk3YmYwZWU0MDczYjZjNjYzZTlmZTAzMTRjZDNlIn0.eyJhdWQiOiI1OWU5OWNmZi04ZjA3LTRjYzAtODlmNi1kOTliNTQ0ZTBhYzQiLCJqdGkiOiJjMDk2NmRmYTg4ZjM0MjM3ZjM4ZmMyOWMwNTg5ZmI3OWYzNzI5YzYwYzNiYzZkNDgyNWM5N2JmMGVlNDA3M2I2YzY2M2U5ZmUwMzE0Y2QzZSIsImlhdCI6MTY5Mzk4NjIzMSwibmJmIjoxNjkzOTg2MjMxLCJleHAiOjE2OTQwNzI2MzEsInN1YiI6IjEwMDQ4NjQyIiwiZ3JhbnRfdHlwZSI6IiIsImFjY291bnRfaWQiOjMxMjc5ODc4LCJiYXNlX2RvbWFpbiI6ImFtb2NybS5ydSIsInZlcnNpb24iOiJ2MiIsInNjb3BlcyI6WyJwdXNoX25vdGlmaWNhdGlvbnMiLCJmaWxlcyIsImNybSIsImZpbGVzX2RlbGV0ZSIsIm5vdGlmaWNhdGlvbnMiXX0.doR7Y0PD97hVNzQY39csO6Yiuq2lFVDfxTHUjsrFKjkaKzrsFqOjG_6zt3DCne2euKScKFW2CaKd5DvMjMTvk2B9PYFQkjJeizGe8wTl37ZGKePClMcZcaar8IyZW2ukEg5Wljv4oiq95aEAhmFAiqF_ApcIelvqmjG27i0Pmc2X2m9Adep1wbG3j9BA1QVb5amRtUuYBvkxRjIUGjLW4QPUy_IQNNrtSVlMOllWtXurJTwwyY2Xa2nl-pKYAeiUfKPm_AluaXgnRVehBAfqHv93NwkZ4_prpWwOoVnSZPuiL624mCIX-K8KAjPyqP7Z13Gx8ZLHlERw3P0x36Ex0Q";
  }

  async getContact(req, res) {
    console.log("req.query", req.query);
    console.log("req.params", req.params);
    const contact = await this.getContactFromAmo(req.params.id);
    return res.json(contact);
  }

  async getContacts(req, res) {
    console.log("req.query", req.query);
    console.log("req.params", req.params);
    const emailOrPhone = req.query.email || req.query.phone;
    let contact = await this.getContactsFromAmo(emailOrPhone);
    if (!contact) {
      contact = await this.createContactInAmo(
        req.query.name,
        req.query.email,
        req.query.phone
      );

      contact = await this.getContactFromAmo(contact.id);
    } else {
      await this.updateContactInAmo(contact.id, req.query.name);

      contact = await this.getContactFromAmo(contact.id);
    }
    return res.status(200).json(contact);
  }

  async updateContactInAmo(id, name) {
    const headers = new Headers();
    headers.append("Authorization", `Bearer ${this.authToken}`);
    headers.append("Content-Type", "application/json");

    const requestOptions = {
      method: "PATCH",
      headers: headers,
      body: JSON.stringify({ name: name }),
    };

    try {
      const response = await fetch(`${this.baseURL}/${id}`, requestOptions);
      const contact = await response.json();
      console.log(contact);
      return contact;
    } catch (error) {
      console.log(error);
    }
  }

  async createContactInAmo(name, email, phone) {
    console.log("createContactInAmo");
    const headers = new Headers();
    headers.append("Authorization", `Bearer ${this.authToken}`);
    headers.append("Content-Type", "application/json");

    const body = [
      {
        first_name: name,
        custom_fields_values: [
          {
            field_id: 1481365,
            values: [
              {
                value: phone,
              },
            ],
          },
          {
            field_id: 1481367,
            values: [
              {
                value: email,
              },
            ],
          },
        ],
      },
    ];
    const requestOptions = {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body),
    };

    console.log("body", JSON.stringify(requestOptions.body));
    try {
      const response = await fetch(this.baseURL, requestOptions);

      const responseData = await response.json();
      const contact = await responseData._embedded.contacts[0];
      console.log("create contact", contact);
      return contact;
    } catch (error) {
      console.log(error);
    }
  }

  async getContactsFromAmo(emailOrPhone) {
    const headers = new Headers();
    headers.append("Authorization", `Bearer ${this.authToken}`);

    const requestOptions = {
      method: "GET",
      headers: headers,
    };

    try {
      console.log("url", `${this.baseURL}?query=${emailOrPhone}`);
      const response = await fetch(
        `${this.baseURL}?query=${emailOrPhone}`,
        requestOptions
      );

      try {
        const responseData = await response.json();
        console.log("responseData", responseData);
        const contact = responseData?._embedded?.contacts[0];
        console.log("contact", contact);
        return contact;
      } catch (ex) {
        return null;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getContactFromAmo(id) {
    const headers = new Headers();
    headers.append("Authorization", `Bearer ${this.authToken}`);

    const requestOptions = {
      method: "GET",
      headers: headers,
    };

    try {
      const response = await fetch(`${this.baseURL}/${id}`, requestOptions);
      const contact = await response.json();
      console.log(contact);
      return contact;
    } catch (error) {
      console.log(error);
    }
  }
}

export default new ContactController();
