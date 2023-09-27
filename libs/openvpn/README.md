# Prowire OpenVPN library

📖 [Technical documentation](https://prowire-vpn.github.io/prowire/libs/openvpn/)

The Prowire OpenVPN Library is a versatile tool for managing and communicating with [OpenVPN](https://openvpn.net/) processes. For client or server use cases, this library offers three core functions:

- **Process Management**: It efficiently spawns and manages OpenVPN processes, ensuring stability and resource optimization.
- **Configuration File Generation**: Easily convert specified parameters into an organized [OpenVPN configuration file](https://openvpn.net/community-resources/reference-manual-for-openvpn-2-4/), securely stored in a temporary directory.
- **Telnet Interface Integration**: Seamlessly connect to the [OpenVPN management interface](https://openvpn.net/community-resources/management-interface/) via a Telnet client, facilitating control and monitoring of OpenVPN processes.

For a visual representation of the library's workflow, refer to the diagram below:

```mermaid
sequenceDiagram
    App->>Library: Call start function
    Library-->> Library: Generate OpenVPN config
    Library-->>System: Store OpenVPN config
    Library->>System: Start OpenVPN process
    System-xOpenVPN: Spawn process
    activate OpenVPN
    Library->>OpenVPN: Connect on Telnet interface
    OpenVPN->>Library: Send status updates
    Library->>App: Emit event
    App->>Library: Call destroy function
    Library->>System: Kill OpenVPN process
    System-xOpenVPN: Kill process
    deactivate OpenVPN
```
