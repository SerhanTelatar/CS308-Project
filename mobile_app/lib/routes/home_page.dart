import 'package:flutter/material.dart';
import 'package:mobile_app/components/recommendations.dart';



class HomePage extends StatelessWidget {
  const HomePage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
          
            const SizedBox(height: 10), // Moved inside the Column
            Expanded(
              child: RecommendationsSection(),
            ),
          ],
        ),
      ),
    );
  }
}
