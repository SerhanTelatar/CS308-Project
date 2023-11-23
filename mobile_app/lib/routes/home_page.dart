import 'package:flutter/material.dart';
import 'package:mobile_app/components/app_drawer.dart';

class HomePage extends StatelessWidget {
  const HomePage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        title: Text('Home'),
        actions: <Widget>[
          IconButton(
            icon: Icon(Icons.person),
            onPressed: () {
              Navigator.pushNamed(context, '/profile');
            },
          ),
        ],
      ),
      drawer: AppDrawer(), // Use the AppDrawer component
      body: Center(
        child: Text(
          'Welcome to the Home Page',
          style: TextStyle(fontSize: 20),
        ),
      ),
    );
  }
}
