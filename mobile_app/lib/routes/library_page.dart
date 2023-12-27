import 'package:flutter/material.dart';

class MyLibraryPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('My Library'),
      ),
      body: Center(
        child: Text('My Library Page Content'),
      ),
    );
  }
}
