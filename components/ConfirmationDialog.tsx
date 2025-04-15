import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';

const ConfirmationDialog = ({ visible, onCancel, onConfirm, title }: any) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
    >
      <View style={styles.modalContainer}>
        <View style={styles.dialogContainer}>
          <Text style={styles.title}>Are you sure?</Text>
          <Text style={styles.message}>{title}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={{...styles.button, ...styles.cancelButton}} onPress={onCancel}>
              <Text style={{...styles.buttonText, ...styles.cancelText}}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{...styles.button, ...styles.deleteButton}} onPress={onConfirm}>
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>
          <Ionicons onPress={onCancel} style={styles.closeIcon} name='close-circle-outline' size={24}/>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dialogContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
    width: '65%'
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 20
  },
  button: {
    padding: 10,
    borderRadius: 5,
    width: '40%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'white',
    borderWidth: 1
  },
  deleteButton: {
    backgroundColor: 'red'
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14
  },
  cancelText: {
    color: 'black'
  },
  closeIcon: {
    position: 'absolute',
    top: 4,
    right: 4,
  }
});

export default ConfirmationDialog;
