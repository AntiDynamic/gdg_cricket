# Getting started

Before you are able to call our API you need a SportMonks account. [Register now.](https://my.sportmonks.com/register)

To make our first request, we’ll need a way to get authenticated first. Cricket API 2.0 utilizes API tokens for the authentication of requests. You can obtain and manage your API tokens in [Mysportmonks](https://my.sportmonks.com/login).

Example API token: \[HdoiD312ND….]

The API token is only meant for your eyes and, as such, should be stored away safely.

{% hint style="info" %}
Our tokens have no expiration date and will remain valid until you manually delete it yourself.
{% endhint %}

Cricket API 2.0 utilizes response codes to indicate successful and failed API requests.\
\
When making a request, a code response will always be returned. See below for a short list of possible code responses:

| Code number | Description                                                                                                     |
| ----------- | --------------------------------------------------------------------------------------------------------------- |
| `200`       | **Successful request and data was returned**                                                                    |
| `400`       | **Part of the request is malformed; the exact reason can be found in the response**                             |
| `401`       | **The request is not authenticated**                                                                            |
| `403`       | **Unauthorized request to access data from an ineligible plan**                                                 |
| `404`       | **This recond is not found. It could be that the data you're trying to access is deleted due to rescheduling.** |
| `429`       | **You have reached the response rate limit of your plan**                                                       |
| `500`       | **Internal error with our servers**                                                                             |

{% hint style="info" %}
We recommend you use Postman for convenience. Every endpoint has an example request ready to be requested by you. Hit the button below to import our Cricket API collection.\
&#x20;                                                             [![Run in Postman](https://run.pstmn.io/button.svg)](https://cricket-postman.sportmonks.com/)
{% endhint %}

With our token in hand, we can finally make the first request!

## Your first request

Now that all prerequisites have been fulfilled, we’re ready to send our first request to the API!

### Build the request

The request consists of the following components:

* The base URL
* A path parameter, in this example, we use \[leagues]
* A query string parameter, this is optional, so we leave this out for now
* And finally, your API token

{% tabs %}
{% tab title="Base URL" %}

```javascript
https://cricket.sportmonks.com/api/v2.0/
```

{% endtab %}
{% endtabs %}

An example of a correctly authenticated request would be:

{% tabs %}
{% tab title="Request" %}

```javascript
https://cricket.sportmonks.com/api/v2.0/leagues?api_token={API_TOKEN}
```

{% endtab %}

{% tab title="Response" %}

```javascript
{
    "data": [
        {
            "resource": "leagues",
            "id": 3,
            "season_id": 312,
            "country_id": 99474,
            "name": "Twenty20 International",
            "code": "T20I",
            "image_path": "https://cdn.sportmonks.com/images/cricket/leagues/3/3.png",
            "type": "phase",
            "updated_at": "2020-03-09T15:32:38.000000Z"
        },
        {
            "resource": "leagues",
            "id": 5,
            "season_id": 525,
            "country_id": 98,
            "name": "Big Bash League",
            "code": "BBL",
            "image_path": "https://cdn.sportmonks.com/images/cricket/leagues/5/5.png",
            "type": "league",
            "updated_at": "2020-07-15T09:34:23.000000Z"
        },
        {
            "resource": "leagues",
            "id": 10,
            "season_id": 648,
            "country_id": 146,
            "name": "CSA T20 Challenge",
            "code": "T20C",
            "image_path": "https://cdn.sportmonks.com/images/cricket/leagues/10/10.png",
            "type": "league",
            "updated_at": "2020-10-20T08:41:32.000000Z"
        }
    ]
}
```

{% endtab %}
{% endtabs %}

This request will return all of the leagues eligible for our free plan, which are the **Twenty20 International (league id: 3), CSA T20 Challenge (league id: 10)** and the **Big Bash League** **(league id: 5).**


---

# Agent Instructions: Querying This Documentation

If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter:

```
GET https://docs.sportmonks.com/v2/cricket-api/getting-started/getting-started.md?ask=<question>
```

The question should be specific, self-contained, and written in natural language.
The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.



-----------------------------------


# Getting started

Before you are able to call our API you need a SportMonks account. [Register now.](https://my.sportmonks.com/register)

To make our first request, we’ll need a way to get authenticated first. Cricket API 2.0 utilizes API tokens for the authentication of requests. You can obtain and manage your API tokens in [Mysportmonks](https://my.sportmonks.com/login).

Example API token: \[HdoiD312ND….]

The API token is only meant for your eyes and, as such, should be stored away safely.

{% hint style="info" %}
Our tokens have no expiration date and will remain valid until you manually delete it yourself.
{% endhint %}

Cricket API 2.0 utilizes response codes to indicate successful and failed API requests.\
\
When making a request, a code response will always be returned. See below for a short list of possible code responses:

| Code number | Description                                                                                                     |
| ----------- | --------------------------------------------------------------------------------------------------------------- |
| `200`       | **Successful request and data was returned**                                                                    |
| `400`       | **Part of the request is malformed; the exact reason can be found in the response**                             |
| `401`       | **The request is not authenticated**                                                                            |
| `403`       | **Unauthorized request to access data from an ineligible plan**                                                 |
| `404`       | **This recond is not found. It could be that the data you're trying to access is deleted due to rescheduling.** |
| `429`       | **You have reached the response rate limit of your plan**                                                       |
| `500`       | **Internal error with our servers**                                                                             |

{% hint style="info" %}
We recommend you use Postman for convenience. Every endpoint has an example request ready to be requested by you. Hit the button below to import our Cricket API collection.\
&#x20;                                                             [![Run in Postman](https://run.pstmn.io/button.svg)](https://cricket-postman.sportmonks.com/)
{% endhint %}

With our token in hand, we can finally make the first request!

## Your first request

Now that all prerequisites have been fulfilled, we’re ready to send our first request to the API!

### Build the request

The request consists of the following components:

* The base URL
* A path parameter, in this example, we use \[leagues]
* A query string parameter, this is optional, so we leave this out for now
* And finally, your API token

{% tabs %}
{% tab title="Base URL" %}

```javascript
https://cricket.sportmonks.com/api/v2.0/
```

{% endtab %}
{% endtabs %}

An example of a correctly authenticated request would be:

{% tabs %}
{% tab title="Request" %}

```javascript
https://cricket.sportmonks.com/api/v2.0/leagues?api_token={API_TOKEN}
```

{% endtab %}

{% tab title="Response" %}

```javascript
{
    "data": [
        {
            "resource": "leagues",
            "id": 3,
            "season_id": 312,
            "country_id": 99474,
            "name": "Twenty20 International",
            "code": "T20I",
            "image_path": "https://cdn.sportmonks.com/images/cricket/leagues/3/3.png",
            "type": "phase",
            "updated_at": "2020-03-09T15:32:38.000000Z"
        },
        {
            "resource": "leagues",
            "id": 5,
            "season_id": 525,
            "country_id": 98,
            "name": "Big Bash League",
            "code": "BBL",
            "image_path": "https://cdn.sportmonks.com/images/cricket/leagues/5/5.png",
            "type": "league",
            "updated_at": "2020-07-15T09:34:23.000000Z"
        },
        {
            "resource": "leagues",
            "id": 10,
            "season_id": 648,
            "country_id": 146,
            "name": "CSA T20 Challenge",
            "code": "T20C",
            "image_path": "https://cdn.sportmonks.com/images/cricket/leagues/10/10.png",
            "type": "league",
            "updated_at": "2020-10-20T08:41:32.000000Z"
        }
    ]
}
```

{% endtab %}
{% endtabs %}

This request will return all of the leagues eligible for our free plan, which are the **Twenty20 International (league id: 3), CSA T20 Challenge (league id: 10)** and the **Big Bash League** **(league id: 5).**


---

# Agent Instructions: Querying This Documentation

If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter:

```
GET https://docs.sportmonks.com/v2/cricket-api/getting-started/getting-started.md?ask=<question>
```

The question should be specific, self-contained, and written in natural language.
The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
