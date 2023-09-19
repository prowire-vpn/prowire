![Prowire logo](https://github.com/prowire-vpn/prowire/assets/59678972/c29365a7-ed86-4d99-86ba-16527bf32926)

# Prowire

> [!WARNING]  
> 🏗 Prowire is currently under construction and no public release is available yet

Distributed corporate VPN made easy. Deploy VPN clusters easily, and manage your users and their access from a simple web interface. Your users can connect using one of our desktop (Windows / Mac / Linux) or mobile (Android / iOS) clients and authenticate using their corporate SSO.

## Understanding

This repository is the Prowire monorepo, which contains all of the different parts of Prowire.

### Architecture

Prowire is made of multiple softwares which work together in order to provider a complete service. They can all be found in different directories of this repository.

- `api`: Main prowire backend, this is where the core functionalities are implemented, such as user authentication or server management.
- `server`: The VPN server itself, it's a wrapper around an OpenVPN server which communicates with the Prowire backend.
- `client`: Client application used to connect a user's device to the VPN network.
- `management`: Management interface used by the system's administrators to manage their users and configure their clusters.

```mermaid
flowchart TD
    A[/User\] -->|Uses| B(Client)
    C[/Admin\] -->|Uses| D(Management interface)
    subgraph Prowire
        E(VPN server) <-.->|Communicate| F(API)
        B -.->|Connects| E
        B -->|Authenticates| F
        D -->|Configures| F
    end
```
<p align="center"><i>Components of Prowire</i></p>

## Developing

Most of this repository is a monorepo of [npm workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces). Therefore most actions can be done from the root directory specifying the workspace in which to run it to npm (ex: `npm run start -w api`).

Please reffer to each individual directories to see documentation on themselves.
