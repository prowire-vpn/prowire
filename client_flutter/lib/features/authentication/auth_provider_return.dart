import "package:flutter/material.dart";
import "package:provider/provider.dart";
import "package:prowire_client/features/authentication/auth_config.dart";

void returnFromUri(Uri uri, BuildContext context) {
  final params = uri.queryParametersAll;

  // Ensure that we are on a success return
  if (params["success"] == null ||
      params["success"]!.length != 1 ||
      params["success"]![0] != "true") {
    const snackBar = SnackBar(
      content: Text("Failed to identify with Provider"),
    );
    ScaffoldMessenger.of(context).showSnackBar(snackBar);
    return;
  }

  final state = Provider.of<AuthConfig>(context, listen: false).state;

  if (params["state"] == null ||
      params["state"]!.length != 1 ||
      params["state"]![0] != state) {
    const snackBar = SnackBar(
      content: Text("Failed to identify with Provider, invalid state"),
    );
    ScaffoldMessenger.of(context).showSnackBar(snackBar);
    return;
  }

  if (params["accessToken"] == null ||
      params["accessToken"]!.length != 1 ||
      params["refreshToken"] == null ||
      params["refreshToken"]!.length != 1) {
    const snackBar = SnackBar(
      content: Text("Failed to identify with Provider, no token provided"),
    );
    ScaffoldMessenger.of(context).showSnackBar(snackBar);
    return;
  }

  Provider.of<AuthConfig>(context, listen: false)
      .setTokens(params["accessToken"]![0], params["refreshToken"]![0]);
}
