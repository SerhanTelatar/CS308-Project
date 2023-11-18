import 'package:flutter/material.dart';

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
              Navigator.pushNamed(
                  context, '/profile'); // Navigate to the login page
            },
          ),
        ],
      ),
        drawer: Drawer(
        child: ListView(
          padding: EdgeInsets.zero,
          children: <Widget>[
            DrawerHeader(
              decoration: BoxDecoration(
                color: Colors.white,
              ),
              child: Center(
                child: Image.asset('assets/logo.png')
              ),
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
            Divider(), // Ayırıcı
            ListTile(
   
              title: Text('Logout'),
              onTap: () {
                // Çıkış işlemleri
              },
            ),
            Divider(), // Ayırıcı
            ListTile(

              leading: CircleAvatar(
                // Profil resmi
                backgroundImage: AssetImage('assets/profile_pic.png'),
              ),
              title: Text('Profile'),
              onTap: () {
                Navigator.of(context).pushReplacementNamed('/profile');
      
              },
            ),
          ],
        ),
      ),
      body: Center(
        child: Text(
          'Welcome to the Home Page',
          style: TextStyle(fontSize: 20),
        ),
      ),
    );
  }
}
