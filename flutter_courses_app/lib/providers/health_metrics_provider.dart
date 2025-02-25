import 'package:flutter/foundation.dart';
import 'package:shared_preferences.dart';
import '../models/health_metric.dart';
import 'dart:convert';

class HealthMetricsProvider with ChangeNotifier {
  List<HealthMetric> _metrics = [];
  SharedPreferences? _prefs;

  List<HealthMetric> get metrics => _metrics;

  HealthMetricsProvider() {
    _initPrefs();
  }

  Future<void> _initPrefs() async {
    _prefs = await SharedPreferences.getInstance();
    _loadMetrics();
  }

  void _loadMetrics() {
    final metricsJson = _prefs?.getStringList('metrics') ?? [];
    _metrics = metricsJson
        .map((json) => HealthMetric.fromJson(jsonDecode(json)))
        .toList();
    if (_metrics.isEmpty) {
      _initializeDefaultMetrics();
    }
    notifyListeners();
  }

  void _initializeDefaultMetrics() {
    _metrics = [
      HealthMetric(
        name: 'Heart Rate',
        value: '75',
        unit: 'bpm',
        icon: '❤️',
        timestamp: DateTime.now(),
      ),
      HealthMetric(
        name: 'Steps',
        value: '0',
        unit: 'steps',
        icon: '👣',
        timestamp: DateTime.now(),
      ),
      HealthMetric(
        name: 'Water',
        value: '0',
        unit: 'L',
        icon: '💧',
        timestamp: DateTime.now(),
      ),
      HealthMetric(
        name: 'Sleep',
        value: '0',
        unit: 'hours',
        icon: '😴',
        timestamp: DateTime.now(),
      ),
    ];
    _saveMetrics();
  }

  void updateMetric(int index, String value) {
    if (index < _metrics.length) {
      _metrics[index] = _metrics[index].copyWith(
        value: value,
        timestamp: DateTime.now(),
      );
      _saveMetrics();
      notifyListeners();
    }
  }

  void _saveMetrics() {
    final metricsJson = _metrics
        .map((metric) => jsonEncode(metric.toJson()))
        .toList();
    _prefs?.setStringList('metrics', metricsJson);
  }
}
