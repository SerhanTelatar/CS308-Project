import 'package:flutter/material.dart';
import 'package:mobile_app/routes/register_page.dart';
import 'package:mobile_app/routes/search_page.dart';
import 'routes/home_page.dart';
import 'routes/login_page.dart';
import 'routes/profile_page.dart';
import 'components/splash_screen.dart';

import 'package:provider/provider.dart';
import 'providers/user_provider.dart';

void main() {
  runApp(
    ChangeNotifierProvider(
      create: (context) => UserProvider(),
      child: const MyApp(),
    ),
  );
}


class MyApp extends StatelessWidget {
  const MyApp({Key? key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'mobile_app',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      initialRoute: '/',
      home: SplashScreen(checkIfUserLoggedIn: checkIfUserLoggedIn()),
      routes: {
        '/home': (context) => HomePage(),
        '/login': (context) => LoginPage(),
        '/register': (context) => RegisterPage(), 
        '/profile': (context) => ProfilePage(),
        '/search' : (context) => SearchPage(),

      },
    );
  }

  
   bool checkIfUserLoggedIn()  {
    
    final baseUrl = "http://10.0.2.2:4200";
    final endpoint = "/girisKontrol";
    Uri.parse('$baseUrl$endpoint');
    
    return false; 
  }


}