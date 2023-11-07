import 'package:flutter/material.dart';
import 'package:mobile_app/routes/register_page.dart';
import 'routes/home_page.dart';
import 'routes/login_page.dart';
import 'routes/profile_page.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'musicmate',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      initialRoute: '/',
      routes: {
        '/': (context) => HomePage(),
        '/login': (context) => LoginPage(),
        '/register': (context) => RegisterPage(), // Add route to RegisterPage
        '/profile': (context) => ProfilePage(isUserLoggedIn: false),
      },
    );
  }
}
