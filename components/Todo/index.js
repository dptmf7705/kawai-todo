import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TextInput,
  AsyncStorage
} from "react-native";
import PropTypes from "prop-types";

const { width, height } = Dimensions.get("window");

class Todo extends Component {
  constructor(props){
    super(props);
    this.state = {
      isEditing: false,
      todoValue: props.text
    };
  }
  static propTypes = {
    id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    isCompleted: PropTypes.bool.isRequired,
    deleteTodo: PropTypes.func.isRequired,
    completeTodo: PropTypes.func.isRequired,
    uncompleteTodo: PropTypes.func.isRequired,
    updateTodo: PropTypes.func.isRequired
  }
  render(){
    const { isEditing, todoValue } = this.state;
    const { text, id, deleteTodo, isCompleted } = this.props;
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this._toggleComplete}>
          <View style={[
              styles.circle, 
              isCompleted ? styles.completedCircle : styles.uncompletedCircle
            ]} />
        </TouchableOpacity>
        
        { isEditing ? (
          <TextInput 
            style={[
              styles.text,
              isCompleted ? styles.completedText : styles.uncompletedText
            ]}
            value={ todoValue } 
            onChangeText={this._controlTodo}
            returnKeyType={"done"}
            autoCorrect={false}
            underlineColorAndroid={"transparent"} 
            multiline={true} 
            onSubmitEditing={this._finishEditing}/>
          ) : (
          <Text style={[
              styles.text,
              isCompleted ? styles.completedText : styles.uncompletedText
            ]}>{text}</Text>
        )}
      
        { isEditing ? (
          /* 수정중인 경우 (저장 버튼) */
          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionContainer} onPress={this._finishEditing}>
              <Text style={styles.actionText}>저장</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* 수정중이 아닌 경우 (수정/삭제 버튼) */
          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionContainer} onPress={this._startEditing}>
              <Text style={styles.actionText}>수정</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionContainer} onPress={this._deleteTodo}>
              <Text style={styles.actionText}>삭제</Text>
            </TouchableOpacity>
          </View>
          )}
      </View>
    )
  }

  _controlTodo = (text) => {
    this.setState({
      todoValue: text
    })
  }

  _toggleComplete = () => {
    const { id, isCompleted, completeTodo, uncompleteTodo } = this.props;
    isCompleted ? uncompleteTodo(id) : completeTodo(id);
  }

  _startEditing = () => {
    const { text } = this.props;
    this.setState({
        isEditing: true,
        todoValue: text
      });
  }

  _finishEditing = () => {
    const { todoValue } = this.state;
    const { id, updateTodo } = this.props;
    updateTodo(id, todoValue);
    this.setState({ isEditing: false });
  }

  _deleteTodo = () => {
    const { id, deleteTodo } = this.props;
     deleteTodo(id);
  }

}

const styles = StyleSheet.create({
  container: {
    width: width - 64,
    borderBottomColor: "#bbb",
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  circle: {
    width: 25,
    height: 25,
    borderRadius: 15,
    borderWidth: 3
  },
  completedCircle: {
    borderColor: "#bbb"
  },
  uncompletedCircle: {
    borderColor: "red"
  },
  completedText: {
    color: "#bbb",
    textDecorationLine: "line-through"
  },
  uncompletedText: {
    color: "#353535"
  },
  text: {
    flex: 1,
    fontSize: 20,
    margin: 15
  },
  actions: {
    flexDirection: "row",
    alignItems: "center"
  },
  actionContainer: {
    paddingVertical: 10,
    paddingHorizontal: 10
  }
})

export default Todo;