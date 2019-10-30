{{- define "rover.labels" }}
  labels:
    'app.kubernetes.io/name': coppa-{{ .Values.brand }}-{{ .Values.stage }}
    environment: {{ .Values.env }}
    brand: {{ .Values.brand }}
    stage: {{ .Values.stage }}
{{- end }}