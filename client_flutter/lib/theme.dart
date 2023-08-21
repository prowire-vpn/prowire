import "package:flutter/material.dart";

var prowireTheme = ThemeData(
    colorScheme: colorScheme,
    backgroundColor: const Color(0xFF042530),
    inputDecorationTheme: inputDecorationTheme,
    textTheme: textTheme);

var colorScheme = const ColorScheme(
    brightness: Brightness.dark,
    primary: Color(0xFF007DA7),
    onPrimary: Colors.white,
    secondary: Colors.white,
    onSecondary: Color(0xFF042530),
    error: Color(0xFFE05A5A),
    onError: Colors.white,
    background: Color(0xFF042530),
    onBackground: Colors.white,
    surface: Colors.white,
    onSurface: Color(0xFF042530),
    onSurfaceVariant: Color(0xFF8D979D),
    tertiary: Color(0xFF8D979D),
    onTertiary: Colors.white);

var inputDecorationTheme = InputDecorationTheme(
    contentPadding:
        EdgeInsets.symmetric(vertical: sizing("xs"), horizontal: sizing("s")),
    border: const OutlineInputBorder(
      borderSide: BorderSide(color: Color(0xFFE5E6E7), width: 0.0),
    ),
    filled: true,
    fillColor: Colors.white,
    hintStyle: const TextStyle(color: Color(0xFF8D979D)));

var textTheme = const TextTheme();

var elevatedButtonTheme = ElevatedButtonThemeData(style: elevatedButtonStyle);

var elevatedButtonStyle = ElevatedButton.styleFrom(
    padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 24),
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(8),
    ),
    minimumSize: const Size.fromHeight(44),
    disabledBackgroundColor: const Color(0xFFE5E6E7));

double sizing(String size) {
  switch (size) {
    case "xs":
      return 8;
    case "s":
      return 12;
    case "md":
      return 24;
    default:
      throw Exception("Invalid sizing provided");
  }
}
