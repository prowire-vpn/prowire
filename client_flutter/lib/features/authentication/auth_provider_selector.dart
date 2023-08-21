import "package:flutter/material.dart";
import "package:url_launcher/url_launcher.dart";
import "dart:math";
import "dart:convert";
import "package:provider/provider.dart";
import "package:prowire_client/features/connect_to_api/client_config.dart";
import "package:prowire_client/features/authentication/auth_config.dart";
import "package:flutter/scheduler.dart";

enum IdentityProvider { google }

const Map<IdentityProvider, String> providersName = {
  IdentityProvider.google: "Google"
};

class AuthProviderSelector extends StatelessWidget {
  static const List<IdentityProvider> _providers = [IdentityProvider.google];

  const AuthProviderSelector({super.key});

  @override
  build(BuildContext context) {
    return Column(
      children: _providers
          .map((provider) => _AuthProviderButton(
                provider: provider,
              ))
          .toList(),
    );
  }
}

class _AuthProviderButton extends StatelessWidget {
  final IdentityProvider provider;

  const _AuthProviderButton({required this.provider});

  @override
  build(BuildContext context) {
    final config = context.watch<ClientConfig>();
    return ElevatedButton.icon(
      onPressed: () => {_goToProvider(config, context)},
      label: Text(providersName[provider] ?? "Unknown"),
      icon: const Icon(Icons.qr_code_scanner),
    );
  }

  Future<void> _goToProvider(ClientConfig config, BuildContext context) async {
    final random = Random.secure();
    final values = List<int>.generate(16, (i) => random.nextInt(256));
    final state = "desktop:${base64Url.encode(values)}";
    final apiUrl = config.getApiUrl;

    final Uri url =
        Uri.parse("$apiUrl/auth/oauth2/start/${provider.name}?state=$state");

    SchedulerBinding.instance.addPostFrameCallback((_) {
      Provider.of<AuthConfig>(context, listen: false).setState(state);
    });

    if (!await launchUrl(url)) {
      throw Exception("Could not launch $apiUrl");
    }
  }
}
