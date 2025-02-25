class HealthMetric {
  final String name;
  final String value;
  final String unit;
  final String icon;
  final DateTime timestamp;

  HealthMetric({
    required this.name,
    required this.value,
    required this.unit,
    required this.icon,
    required this.timestamp,
  });

  HealthMetric copyWith({
    String? name,
    String? value,
    String? unit,
    String? icon,
    DateTime? timestamp,
  }) {
    return HealthMetric(
      name: name ?? this.name,
      value: value ?? this.value,
      unit: unit ?? this.unit,
      icon: icon ?? this.icon,
      timestamp: timestamp ?? this.timestamp,
    );
  }

  Map<String, dynamic> toJson() => {
        'name': name,
        'value': value,
        'unit': unit,
        'icon': icon,
        'timestamp': timestamp.toIso8601String(),
      };

  factory HealthMetric.fromJson(Map<String, dynamic> json) => HealthMetric(
        name: json['name'],
        value: json['value'],
        unit: json['unit'],
        icon: json['icon'],
        timestamp: DateTime.parse(json['timestamp']),
      );
}
