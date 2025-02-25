import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'screens/home_screen.dart';
import 'providers/health_metrics_provider.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => HealthMetricsProvider(),
      child: MaterialApp(
        title: 'Health Tracker',
        theme: ThemeData(
          primarySwatch: Colors.green,
          scaffoldBackgroundColor: Colors.grey[100],
          cardTheme: CardTheme(
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16),
            ),
          ),
        ),
        home: HomeScreen(),
      ),
    );
  }
}
