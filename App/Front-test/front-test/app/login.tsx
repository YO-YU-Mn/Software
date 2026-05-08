import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
} from 'react-native';

import { useState } from 'react';

import { useAuth } from '../context/AuthContext';

import { loginStudent } from '../services/auth';

export default function Login() {

  const { login } = useAuth();

  const [code, setCode] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [error, setError] =
    useState('');

  async function handleLogin() {

    try {

      const data =
        await loginStudent(code, password);

      if (data.success) {

        await login(data.token);

      } else {

        setError(data.message);
      }

    } catch (err) {

      setError('Network Error');
    }
  }

  return (

    <View style={styles.container}>

      <Text style={styles.title}>
        Cairo University
      </Text>

      <Text style={styles.subtitle}>
        Student Login
      </Text>

      <TextInput
        style={styles.input}
        placeholder="University ID"
        value={code}
        onChangeText={setCode}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {error ? (
        <Text style={styles.error}>
          {error}
        </Text>
      ) : null}

      <Pressable
        style={styles.button}
        onPress={handleLogin}
      >

        <Text style={styles.buttonText}>
          Login
        </Text>

      </Pressable>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {

    flex: 1,

    justifyContent: 'center',

    padding: 20,

    backgroundColor: '#fff',
  },

  title: {

    fontSize: 32,

    fontWeight: 'bold',

    marginBottom: 10,
  },

  subtitle: {

    fontSize: 18,

    marginBottom: 30,

    color: 'gray',
  },

  input: {

    borderWidth: 1,

    borderColor: '#ccc',

    borderRadius: 12,

    padding: 15,

    marginBottom: 15,
  },

  button: {

    backgroundColor: '#2563eb',

    padding: 15,

    borderRadius: 12,

    alignItems: 'center',
  },

  buttonText: {

    color: 'white',

    fontSize: 16,

    fontWeight: 'bold',
  },

  error: {

    color: 'red',

    marginBottom: 15,
  },
});