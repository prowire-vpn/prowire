import "package:flutter/material.dart";
import "package:app_links/app_links.dart";
import "dart:async";
import "package:prowire_client/features/authentication/auth_provider_return.dart";
import "package:flutter/scheduler.dart";

class LinkListener extends StatefulWidget {
  final Widget child;

  const LinkListener({super.key, required this.child});

  @override
  LinkListenerState createState() => LinkListenerState();
}

class LinkListenerState extends State<LinkListener> {
  late AppLinks _appLinks;
  StreamSubscription<Uri>? _linkSubscription;
  Uri? currentUri;

  @override
  void initState() {
    super.initState();

    initDeepLinks();
  }

  @override
  void dispose() {
    _linkSubscription?.cancel();

    super.dispose();
  }

  Future<void> initDeepLinks() async {
    _appLinks = AppLinks();

    // Check initial link if app was in cold state (terminated)
    final appLink = await _appLinks.getInitialAppLink();
    if (appLink != null) {
      openAppLink(appLink);
    }

    // Handle link when app is in warm state (front or background)
    _linkSubscription = _appLinks.uriLinkStream.listen((uri) {
      openAppLink(uri);
    });
  }

  void openAppLink(Uri uri) {
    setState(() {
      currentUri = uri;
    });
  }

  @override
  Widget build(BuildContext context) {
    SchedulerBinding.instance.addPostFrameCallback((_) {
      if (currentUri != null) {
        final fullPath = "${currentUri!.host}${currentUri!.path}";
        switch (fullPath) {
          case "oauth/return":
            returnFromUri(currentUri as Uri, context);
            break;
          default:
            final snackBar = SnackBar(
              content: Text("Unknown path $fullPath"),
            );
            ScaffoldMessenger.of(context).showSnackBar(snackBar);
            break;
        }
      }
    });
    return widget.child;
  }
}
