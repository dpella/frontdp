# FrontDP

A front-end for the Differential Privacy API WebDP.

![FrontDP](https://github.com/dpella/frontdp/blob/main/logos/FrontDP_Logo_Horisontal_Black.png)

## Goal

The goal of this project is to provide a user-friendly front-end interface for interacting with the WebDP API. This interface facilitates differential privacy tasks and analysis, allowing data curators to share datasets and assign analysts, and enabling data analysts to perform analytical queries while maintaining the privacy of individuals in the dataset.

## Who are we?

We are a team of students from the Department of Computer Science and Engineering at Chalmers University of Technology and University of Gothenburg. Our team consists of the following five members:

- [Andres Arriagada Fuentes](https://github.com/andresarriagadafuentes)
- [Ann Heijkenskjöld](https://github.com/Annheij)
- [Kristin Hulling](https://github.com/Hulling)
- [Eric Källman](https://github.com/k4llman)
- [Wilma Nordlund](https://github.com/wwwilma)

## About WebDP

[WebDP](https://editor.swagger.io/?url=https://webdp.dev/api/WebDP-1.0.0.yml) is an open-source API developed by [DPella](www.dpella.io) for the
[EU-funded TERMINET Project](https://terminet-h2020.eu/).  
The API is designed using standard development practices and open-source tools,
and uses OpenAPI version 3.0.0 specification to define the API schemas (i.e.,
the types of the data handled by requests and responses to/from a WebDP
server), as well as the different HTTP endpoint (i.e., the differentially
private operations that a compliant WebDP server must support).
The API is divided into four main operation categories: _User management_
(e.g., creating, updating and deleting users), _Dataset management_ (e.g.,
creating, updating and deleting datasets), _Budget tracking_ (e.g., allocating
the global privacy budget of different datasets across different users), and
_Query evaluation_ (e.g., interpreting generic JSON-defined DP queries).

## Usage

Before you start, make sure you have the following software installed:

- **npm**

  ```bash
  $ npm install react-scripts
  ```

How to start the React application:

```bash
$ npm start
```
### Configuring the WebDP Server IP and Port
By default, the development environment uses a proxy configuration to forward API requests to the WebDP server running at http://localhost:8080. This is specified in the package.json file:
```bash
"proxy": "http://localhost:8080/"
```
If you need to specify a different IP address or port for the WebDP server, you can do so by updating this proxy setting.


Reach out if you have any questions!

/ The FrontDP Team

![FrontDP](https://github.com/dpella/frontdp/blob/main/logos/FrontDP_Logo_Square_Black.png)
