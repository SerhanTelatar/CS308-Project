import 'dart:async';
import 'package:flutter/material.dart';
class SplashScreen extends StatefulWidget {
  final bool checkIfUserLoggedIn;
  SplashScreen({Key? key, required this.checkIfUserLoggedIn}) : super(key: key);
  

  @override
  _SplashScreenState createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {

  @override
  void initState() {
    bool checkIfUserLoggedIn = widget.checkIfUserLoggedIn;
    super.initState();
   Timer(const Duration(seconds: 3), () {
      if(!checkIfUserLoggedIn){
        Navigator.of(context).pushReplacementNamed('/login');
      }
      else {
        Navigator.of(context).pushReplacementNamed('/home');
      } 
   });
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      color: Colors.white,
      child: Center(
        child: Image.asset('assets/images/logo.png'), 
      ),
    );
  }
  

}