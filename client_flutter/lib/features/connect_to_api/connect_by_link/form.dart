import "package:flutter/material.dart";
import "dart:convert";
import "package:prowire_client/theme.dart";
import "package:http/http.dart" as http;
import "package:provider/provider.dart";
import "package:prowire_client/features/connect_to_api/client_config.dart";

class ConnectByLinkForm extends StatefulWidget {
  const ConnectByLinkForm({super.key});

  @override
  ConnectByLinkFormState createState() {
    return ConnectByLinkFormState();
  }
}

class ConnectByLinkFormState extends State<ConnectByLinkForm> {
  final _formKey = GlobalKey<FormState>();
  final urlController = TextEditingController();

  bool _canSubmit = false;
  bool _isConnecting = false;
  String? _error;

  @override
  void dispose() {
    urlController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Form(
        key: _formKey,
        child: Column(children: [
          Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text("Enter Prowire server URL",
                    style: TextStyle(
                        color: Theme.of(context).colorScheme.tertiary),
                    textAlign: TextAlign.left),
                SizedBox(height: sizing("xs")),
                TextFormField(
                  autovalidateMode: AutovalidateMode.onUserInteraction,
                  controller: urlController,
                  validator: (value) {
                    return Uri.parse(value ?? "").isAbsolute
                        ? null
                        : "Invalid URL";
                  },
                  onChanged: (value) => {_onChanged()},
                  decoration: const InputDecoration(
                      border: OutlineInputBorder(),
                      hintText: "Ex: https://prowire.my-company.com"),
                  style: TextStyle(
                      color: Theme.of(context).colorScheme.onSecondary),
                )
              ]),
          SizedBox(height: sizing("md")),
          ElevatedButton(
              onPressed: _canSubmit == true && _isConnecting == false
                  ? () => {_onSubmit(urlController.text)}
                  : null,
              child: const Text("Connect to Prowire")),
          if (_error != null)
            Text(_error as String,
                style: TextStyle(color: Theme.of(context).colorScheme.error))
        ]));
  }

  void _onChanged() {
    setState(() {
      _canSubmit = _formKey.currentState!.validate();
    });
  }

  void _onSubmit(String url) async {
    setState(() {
      _isConnecting = true;
    });
    try {
      final response = await http.get(Uri.parse("$url/client/config"));

      if (response.statusCode != 200) {
        throw Exception("Non 200 response from Prowire server");
      }

      ClientConfigResponse.fromJson(
          jsonDecode(response.body) as Map<String, dynamic>);

      setState(() {
        _error = null;
        _isConnecting = false;
      });

      if (mounted) {
        Provider.of<ClientConfig>(context, listen: false).setConfig(url);
      }
    } catch (error) {
      setState(() {
        _error = "Failed to connect to Prowire server";
        _isConnecting = false;
      });
    }
  }
}

class ClientConfigResponse {
  final String googleClientId;

  const ClientConfigResponse({
    required this.googleClientId,
  });

  factory ClientConfigResponse.fromJson(Map<String, dynamic> json) {
    return ClientConfigResponse(
        googleClientId: json["googleClientId"] as String);
  }
}
