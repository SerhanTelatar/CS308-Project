import 'package:flutter/material.dart';
import 'package:mobile_app/routes/analytics_page.dart';
import 'package:mobile_app/routes/library_page.dart';
import 'components/navigation_bar.dart';
import 'routes/home_page.dart';
import 'routes/login_page.dart';
import 'routes/register_page.dart';
import 'routes/profile_page.dart';
import 'components/splash_screen.dart';
import 'package:provider/provider.dart';
import 'providers/user_provider.dart';
import 'package:mobile_app/components/app_drawer.dart';
import 'routes/settings_page.dart';
void main() {
  runApp(
    ChangeNotifierProvider(
      create: (context) => UserProvider(),
      child: const MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

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
        '/home': (context) => MainApp(), // Set MainApp as the home route
        '/login': (context) => LoginPage(),
        '/register': (context) => RegisterPage(),
        '/profile': (context) => ProfilePage(),
        '/analytics': (context) => AnalyticsPage(),
        '/mylibrary': (context) => MyLibraryPage(),
        '/settings': (context) => settings_page(),
      },
    );
  }

  bool checkIfUserLoggedIn() {
    // Add your logic to check if the user is logged in
    return false;
  }
}

class MainApp extends StatefulWidget {
  @override
  _MainAppState createState() => _MainAppState();
}

class _MainAppState extends State<MainApp> {
  int _selectedIndex = 1;

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    List<Widget> _pages = [
      AnalyticsPage(),
      HomePage(),
      MyLibraryPage(),
      ProfilePage(), // Profile page without bottom navigation bar
    ];

    return Scaffold(
      appBar: MyAppBar(), // Use the global app bar
      drawer: const AppDrawer(), // Use the global drawer
      body: _pages[_selectedIndex],
      bottomNavigationBar: _selectedIndex != _pages.length - 1
          ? BottomNavigationBarComponent(_selectedIndex, _onItemTapped)
          : null, // Hide bottom navigation bar on the Profile page
    );
  }
}

class MyAppBar extends StatelessWidget implements PreferredSizeWidget {
  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);

  @override
  Widget build(BuildContext context) {
    return AppBar(
      backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      actions: [
        IconButton(
          icon: const Icon(Icons.person),
          onPressed: () {
            Navigator.pushReplacementNamed(context, '/profile');
          },
        ),
      ],
    );
  }
}