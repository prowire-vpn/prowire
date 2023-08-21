import "package:flutter/material.dart";

class ConnectByQrForm extends StatelessWidget {
  const ConnectByQrForm({super.key});

  @override
  Widget build(BuildContext context) {
    return ElevatedButton.icon(
      onPressed: () => {},
      label: const Text("Scan a connection QR code"),
      icon: const Icon(Icons.qr_code_scanner),
    );
  }
}
