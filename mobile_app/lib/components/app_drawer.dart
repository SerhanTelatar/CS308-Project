import 'package:flutter/material.dart';

class AppDrawer extends StatelessWidget {
  const AppDrawer({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: ListView(
        padding: EdgeInsets.zero,
        children: <Widget>[
          DrawerHeader(
            decoration: BoxDecoration(
              color: Colors.white,
            ),
            child: Center(child: Image.asset('assets/images/logo.png')),
          ),
          ListTile(
            title: Text('Homepage'),
            onTap: () {
              Navigator.of(context).pushReplacementNamed('/home');
            },
          ),
          ListTile(
            title: Text('Search'),
            onTap: () {
              Navigator.of(context).pushReplacementNamed('/search');
            },
          ),
          ListTile(
            title: Text('Settings'),
            onTap: () {
              Navigator.of(context).pushReplacementNamed('/settings');
            },
          ),
          ListTile(
            title: Text('Support'),
            onTap: () {
              Navigator.of(context).pushReplacementNamed('/support');
            },
          ),
          Divider(), // Separator
          ListTile(
            title: Text('Logout'),
            onTap: () {
              // Logout operations
            },
          ),
          Divider(), // Separator
          ListTile(
            leading: CircleAvatar(
              backgroundImage: AssetImage('assets/images/logo.png'),
            ),
            title: Text('Profile'),
            onTap: () {
              Navigator.pushNamed(context, '/profile');//use this one to make it work with navigation correctly
            },
          ),
        ],
      ),
    );
  }
}
