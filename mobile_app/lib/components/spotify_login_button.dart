import 'package:flutter/material.dart';

class SpotifyLoginButton extends StatelessWidget {
  final VoidCallback? onPressed;

  const SpotifyLoginButton({Key? key, this.onPressed}) : super(key: key);


  @override
  Widget build(BuildContext context) {
    return ElevatedButton.icon(
      icon: Image.asset(
        'assets/images/spotify_logo.png', 
        height: 24.0, 
        width: 24.0,
      ),
      label: const Text('Continue with Spotify'),
      onPressed: onPressed,
      style: ElevatedButton.styleFrom(
        primary: const Color(0xFF1DB954), 
        onPrimary: Colors.white,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(24),
        ),
        padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 12.0), 
       minimumSize: const Size(200, 50), 
      ),
    );
  }
}
