import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_courses_app/screens/home_screen.dart';

void main() {
  testWidgets('HomeScreen has a title and a list of courses', (WidgetTester tester) async {
    await tester.pumpWidget(MaterialApp(home: HomeScreen()));

    // Verify that the title is present
    expect(find.text('Courses'), findsOneWidget);

    // Verify that the list of courses is present
    expect(find.byType(ListView), findsOneWidget);
  });
}