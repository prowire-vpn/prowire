import "package:flutter/material.dart";
import "package:prowire_client/screens/api_selection_page.dart";
import "package:prowire_client/theme.dart";
import "package:prowire_client/screens/user_connection_page.dart";
import "package:prowire_client/features/connect_to_api/client_config.dart";
import "package:prowire_client/screens/vpn_connection_page.dart";
import "package:provider/provider.dart";
import "package:prowire_client/features/app_link/app_link.dart";
import "package:prowire_client/features/authentication/auth_config.dart";
import "dart:io";

void main() {
  // Disable HTTPS check
  HttpOverrides.global = MyHttpOverrides();
  runApp(const MyApp());
}

class MyHttpOverrides extends HttpOverrides {
  @override
  HttpClient createHttpClient(SecurityContext? context) {
    return super.createHttpClient(context)
      ..badCertificateCallback =
          (X509Certificate cert, String host, int port) => true;
  }
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
        providers: [
          ChangeNotifierProvider(create: (context) => ClientConfig()),
          ChangeNotifierProvider(create: ((context) => AuthConfig()))
        ],
        child: MaterialApp(
          theme: prowireTheme,
          initialRoute: "/onboarding/api-selection",
          builder: (context, child) {
            if (child == null) return const Text("ERROR");
            return ElevatedButtonTheme(
                data: elevatedButtonTheme,
                child: Scaffold(
                    backgroundColor: const Color(0xFF042530),
                    body: LinkListener(
                        child: Container(
                            padding: EdgeInsets.all(sizing("md")),
                            child: child))));
          },
          home: const Home(),
        ));
  }
}

class Home extends StatelessWidget {
  const Home({super.key});

  @override
  Widget build(BuildContext context) {
    final clientConfig = context.watch<ClientConfig>();
    final authConfig = context.watch<AuthConfig>();

    if (clientConfig.apiUrl == null) {
      return const ApiSelectionPage();
    } else if (authConfig.accessToken == null ||
        authConfig.refreshToken == null) {
      return const UserConnectionPage();
    }
    return const VpnConnectionPage();
  }
}
