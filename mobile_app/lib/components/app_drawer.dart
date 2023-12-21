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
            decoration: const BoxDecoration(
              color: Colors.white,
            ),
            child: Center(child: Image.asset('assets/images/logo.png')),
          ),
          ListTile(
            title: const Text('Homepage'),
            onTap: () {
              Navigator.of(context).pushReplacementNamed('/home');
            },
          ),
          ListTile(
            title: const Text('Search'),
            onTap: () {
              Navigator.of(context).pushReplacementNamed('/search');
            },
          ),
          ListTile(
            title: const Text('Settings'),
            onTap: () {
              Navigator.of(context).pushReplacementNamed('/settings');
            },
          ),
          ListTile(
            title: const Text('Support'),
            onTap: () {
              Navigator.of(context).pushReplacementNamed('/support');
            },
          ),
          const Divider(), // Ayırıcı
          ListTile(
            title: const Text('Logout'),
            onTap: () {
              // Çıkış işlemleri
            },
          ),
          const Divider(), // Ayırıcı
          ListTile(
            leading: const CircleAvatar(
              // Profil resmi
              backgroundImage: AssetImage('assets/images/logo.png'),
            ),
            title: const Text('Profile'),
            onTap: () {
              Navigator.of(context).pushReplacementNamed('/profile');
            },
          ),
        ],
      ),
    );
  }
}
