import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, ScrollView, SafeAreaView } from 'react-native';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#7f1d1d' }}>
          <ScrollView contentContainerStyle={{ padding: 20 }}>
            <Text style={{ fontSize: 24, color: 'white', fontWeight: 'bold', marginBottom: 10 }}>App Crashed!</Text>
            <Text style={{ color: '#fca5a5', marginBottom: 20, fontSize: 16 }}>{this.state.error?.toString()}</Text>
            <Text style={{ color: '#fecaca', fontFamily: 'monospace', fontSize: 12 }}>
              {this.state.errorInfo?.componentStack}
            </Text>
          </ScrollView>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}
