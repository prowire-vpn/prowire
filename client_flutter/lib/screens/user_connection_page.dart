import "package:flutter/material.dart";
import "package:prowire_client/theme.dart";
import "package:prowire_client/features/authentication/auth_provider_selector.dart";

class UserConnectionPage extends StatelessWidget {
  const UserConnectionPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Text("👋 Welcome to Prowire",
              style: Theme.of(context)
                  .textTheme
                  .headline6
                  ?.copyWith(color: Theme.of(context).colorScheme.onBackground),
              textAlign: TextAlign.center),
          SizedBox(height: sizing("xs")),
          Text("How would you like to identify yourself ?",
              style: Theme.of(context).textTheme.bodyText1?.copyWith(
                  color: Theme.of(context).colorScheme.onSurfaceVariant),
              textAlign: TextAlign.center),
          SizedBox(height: sizing("md")),
          const AuthProviderSelector(),
        ]);
  }
}
