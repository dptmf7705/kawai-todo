import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TextInput
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
    text: PropTypes.string.isRequired,
    isCompleted: PropTypes.bool.isRequired,
    deleteTodo: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired
  }
  render(){
    const { isEditing, isCompleted, todoValue } = this.state;
    const { text, id, deleteTodo } = this.props;
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
              styles.input,
              styles.text,
              isCompleted ? styles.completedText : styles.uncompletedText
            ]}
            value={todoValue} 
            multiline={true} />
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
            <TouchableOpacity style={styles.actionContainer} onPress={deleteTodo(id)}>
              <Text style={styles.actionText}>삭제</Text>
            </TouchableOpacity>
          </View>
          )}
      </View>
    )
  }

  _toggleComplete = () => {
    this.setState(prevState => {
      return {
        isCompleted: !prevState.isCompleted
      }
    })
  }

  _startEditing = () => {
    const { text } = this.props;
    this.setState({
        isEditing: true,
        todoValue: text
      });
  }

  _finishEditing = () => {
    this.setState(prevState => {
      return {
        isEditing: false
      }
    })
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