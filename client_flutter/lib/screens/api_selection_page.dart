import "package:flutter/material.dart";
import "package:flutter_svg/flutter_svg.dart";
import "package:prowire_client/features/connect_to_api/connect_by_link/form.dart";
import "package:prowire_client/features/connect_to_api/connect_by_qr/form.dart";
import "package:prowire_client/theme.dart";

class ApiSelectionPage extends StatelessWidget {
  const ApiSelectionPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          const ProwireLogo(),
          SizedBox(height: sizing("md")),
          Text("How would you like to connect to Prowire",
              style: Theme.of(context)
                  .textTheme
                  .headline6
                  ?.copyWith(color: Theme.of(context).colorScheme.onBackground),
              textAlign: TextAlign.center),
          SizedBox(height: sizing("md")),
          const ConnectByQrForm(),
          SizedBox(height: sizing("md")),
          const SeparatorWithText(text: "or"),
          SizedBox(height: sizing("md")),
          const ConnectByLinkForm()
        ]);
  }
}

class ProwireLogo extends StatelessWidget {
  const ProwireLogo({super.key});

  @override
  Widget build(BuildContext context) {
    return FractionallySizedBox(
        widthFactor: 0.5,
        child: ConstrainedBox(
            constraints: const BoxConstraints(minWidth: 100, maxWidth: 350),
            child: SvgPicture.asset("assets/logo.svg",
                semanticsLabel: "Prowire Logo")));
  }
}

class SeparatorWithText extends StatelessWidget {
  final String text;

  const SeparatorWithText({super.key, required this.text});

  @override
  Widget build(BuildContext context) {
    return Row(children: [
      Expanded(
          child: Container(
              height: 1, color: Theme.of(context).colorScheme.tertiary)),
      Container(
          padding: EdgeInsets.only(left: sizing("xs"), right: sizing("xs")),
          child: Text(text,
              style: TextStyle(color: Theme.of(context).colorScheme.tertiary))),
      Expanded(
          child: Container(
              height: 1, color: Theme.of(context).colorScheme.tertiary))
    ]);
  }
}
