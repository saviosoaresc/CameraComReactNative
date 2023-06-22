import React, { useState, useEffect, useRef} from "react";
import {
  StyleSheet, //estilos
  Text,
  View,
  SafeAreaView, //mesmo que View, servindo tbm para iphones
  TouchableOpacity, //button personalizado
  Modal, //area adicional na tela
  Image,
} from "react-native";
import { Camera } from "expo-camera";
import { FontAwesome } from "@expo/vector-icons";

export default function App() {
  const camRef = useRef(null); //camRef recebe a camera null
  const [type, setType] = useState(Camera.Constants.Type.back); //ser iniciada com a camera traseira
  const [hasPermission, setHasPermission] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null); 
  const [open, setOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();        // pedido de acesso a camera
      setHasPermission(status === "granted");                                 //
    })();
  }, []);

  if (hasPermission === null) {             // se a permissao nao receber nada, aparece uma view limpa
    return <View/>;
  }
  if (hasPermission === false) {            // se n ter permissao, uma msg eh emitida
    return <Text>Acesso Negado</Text>;
  }

  async function takePicture() {
    if (camRef) {
      const data = await camRef.current.takePictureAsync();       //"data" recebe o tirar da foto
      setCapturedPhoto(data.uri);                                 //o captured recebe o link do tirar da foto
      setOpen(true);                                              // o open recebe TRUE
    }
  }

  return (                                                        // essa safe eh toda a area
    <SafeAreaView style={styles.container}>                                                   
      <Camera style={styles.camera} type={type} ref={camRef}>
        <View                                                                                 // essa eh uma view dos button na parte debaixo
        style={styles.contentButtons}>                                                  

          <TouchableOpacity                                                                   // esse eh o button de trocar de camera
            style={styles.buttonFlip}
            onPress={() => {                                                                  //ao clicar recebe a camera traseira, se clicar novamente recebe a frontal e assim sucessivamente
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}
          >
            <FontAwesome name="exchange" size={23} color={"red"}></FontAwesome>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonCamera} onPress={takePicture}>
            <FontAwesome name="camera" size={23} color={"#fff"}></FontAwesome>
          </TouchableOpacity>

        </View>
      </Camera>


      {capturedPhoto && (                                                                      //link da foto &&
        <Modal animationType="slide"                                                           // a visible do modal recebe o open, so sera true ao clicar na camera 
        transparent={true} 
        visible={open}>
          <View style={styles.contentModal}>
            <TouchableOpacity                                                                  // button para fechar o modal
              style={styles.closeButton}
              onPress={() => setOpen(false)}                                                   // no clique, open recebe falso e o modal eh fechado
            >
              <FontAwesome name="close" size={50} color={"#fff"}></FontAwesome>
            </TouchableOpacity>

            <Image style={styles.imgPhoto}                                                     //a uri da imagem, recebe o link onde esta no const "capturedPhoto"
            source={{ uri: capturedPhoto }} />
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  camera: {
    width: "100%",
    height: "100%",
  },
  contentButtons: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
  },
  buttonFlip: {
    position: "absolute",
    bottom: 50,
    left: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    margin: 20,
    height: 50,
    width: 50,
    borderRadius: 50,
  },
  buttonCamera: {
    position: "absolute",
    bottom: 50,
    right: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "red",
    margin: 20,
    height: 50,
    width: 50,
    borderRadius: 50,
  },
  contentModal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
    margin: 20,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    left: 2,
    margin: 10,
  },
  imgPhoto: {
    width: "100%",
    height: 400,
  },
});
