import "package:flutter/material.dart";
import "package:prowire_client/features/connect_to_api/client_config.dart";
import "package:prowire_client/features/authentication/auth_config.dart";
import "package:provider/provider.dart";
import "package:prowire_client/features/vpn/vpn_config.dart";
import "package:prowire_client/features/vpn/open_vpn.dart";

class ConnectButton extends StatelessWidget {
  const ConnectButton({super.key});

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
        style: ElevatedButton.styleFrom(
            backgroundColor: Theme.of(context).colorScheme.primary,
            shape: const CircleBorder()),
        onPressed: () async {
          await connectVpn(context);
        },
        child: const Text("Start"));
  }
}

Future<void> connectVpn(BuildContext context) async {
  final apiUrl = context.read<ClientConfig>().apiUrl as String;
  final accessToken = context.read<AuthConfig>().accessToken as String;
  final config = await VpnConfig.fetch(accessToken, apiUrl);
  final conigPath = await config.saveConfig();
  await OpenVpn(conigPath).start();
}
