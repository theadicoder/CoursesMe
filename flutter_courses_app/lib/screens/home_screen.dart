import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../providers/health_metrics_provider.dart';

class HomeScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Health Tracker'),
        elevation: 0,
      ),
      body: Consumer<HealthMetricsProvider>(
        builder: (context, provider, child) {
          return GridView.builder(
            padding: EdgeInsets.all(16.0),
            gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              crossAxisSpacing: 16,
              mainAxisSpacing: 16,
            ),
            itemCount: provider.metrics.length,
            itemBuilder: (context, index) {
              final metric = provider.metrics[index];
              return Card(
                elevation: 4,
                child: InkWell(
                  onTap: () => _showUpdateDialog(context, provider, index),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        metric.icon,
                        style: TextStyle(fontSize: 40),
                      ),
                      SizedBox(height: 8),
                      Text(
                        metric.name,
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      SizedBox(height: 4),
                      Text(
                        '${metric.value} ${metric.unit}',
                        style: TextStyle(fontSize: 14),
                      ),
                      SizedBox(height: 4),
                      Text(
                        DateFormat('HH:mm').format(metric.timestamp),
                        style: TextStyle(
                          fontSize: 12,
                          color: Colors.grey,
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }

  void _showUpdateDialog(BuildContext context, HealthMetricsProvider provider, int index) {
    final controller = TextEditingController(text: provider.metrics[index].value);
    
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Update ${provider.metrics[index].name}'),
        content: TextField(
          controller: controller,
          keyboardType: TextInputType.number,
          decoration: InputDecoration(
            suffix: Text(provider.metrics[index].unit),
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              provider.updateMetric(index, controller.text);
              Navigator.pop(context);
            },
            child: Text('Save'),
          ),
        ],
      ),
    );
  }
}
