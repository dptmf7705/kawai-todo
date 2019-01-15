import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  StatusBar, 
  TextInput,
  Dimensions,
  Platform,
  ScrollView} from 'react-native';
  import { AppLoading } from "expo";
  import Todo from './components/Todo/index.js';
  import uuidv1 from "uuid/v1";

const { height, width } = Dimensions.get("window");

export default class App extends React.Component {
  state = {
    newTodo: null,
    isLoaded: false,
    todos: {}
  }

  componentDidMount = () => {
    this._loadTodos();
  }

  render() {
    const { newTodo, isLoaded, todos } = this.state;
    
    console.log(todos);

    if(!isLoaded){
      return (<AppLoading />)
    }

    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.title}>Kawai To Do</Text>
        <View style={styles.card}>
          <TextInput 
            style={styles.input} 
            placeholder={"New To Do"}
            value={newTodo}
            onChangeText={this._controlNewTodo}
            placeholderTextColor={"#999"}
            returnKeyType={"done"}
            autoCorrect={false}
            underlineColorAndroid={"transparent"} 
            onSubmitEditing={this._addTodo}/>
          <ScrollView contentContainerStyle={styles.todos}>
            {Object.values(todos).reverse().map(todo => 
                <Todo 
                  key={todo.id} 
                  { ...todo } 
                  deleteTodo={this._deleteTodo}
                  completeTodo={this._completeTodo}
                  uncompleteTodo={this._uncompleteTodo}
                  updateTodo={this._updateTodo} />)}
          </ScrollView>
        </View>
      </View>
    );
  }

  _controlNewTodo = (text) => {
    this.setState({
      newTodo: text
    })
  }

  _loadTodos = () => {
    this.setState({
      isLoaded: true
    })
  }

  _addTodo = () => {
    const { newTodo } = this.state;
    if(newTodo != ""){
      this.setState(prevState => {
        const ID = uuidv1();
        // 새로 추가할 todo
        const newTodoObject = {
          [ID]: {
            id: ID,
            isCompleted: false,
            text: newTodo,
            createdAt: Date.now()
          }
        }
        const newState = {
          ...prevState, // 이전 state 유지
          newTodo: "",
          todos: { // todos 추가
            ...prevState.todos, // 이전 todos 유지
            ...newTodoObject // newTodoObject 안의 내용만 꺼내옴
            // ... 안붙이면 newTodoObject: id: ID ... 이름까지 저장됨
          }
        };
        _saveTodos(newState.todos);
        return { ...newState }; // 마찬가지 ...붙이기
      });
    }
  }

  _deleteTodo = (id) => {
    this.setState(prevState => {
      const todos = prevState.todos;
      delete todos[id];
      const newState = {
        ...prevState,
        ...todos
      };
      _saveTodos(newState.todos);
      return { ...newState };
    })
  }

  _uncompleteTodo = (id) => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        todos: {
          ...prevState.todos,
          [id] : {
            ...prevState.todos[id],
            isCompleted: false
          }
        }
      }
      _saveTodos(newState.todos);
      return newState;
    })
  }
  
  _completeTodo = (id) => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        todos: {
          ...prevState.todos,
          [id] : {
            ...prevState.todos[id],
            isCompleted: true
          }
        }
      }
      _saveTodos(newState.todos);
      return newState;
    })
  }

  _updateTodo = (id, text) => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        todos: {
          ...prevState.todos,
          [id] : {
            ...prevState.todos[id],
            text: text
          }
        }
      }
      _saveTodos(newState.todos);
      return { ...newState };
    })
  }
  
  _saveTodos = (newTodos) => {
    console.log(JSON.stringify(newTodos));
    // const saveTodos = AsyncStorage.setItem("todos", newTodos);
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F23657',
    alignItems: 'center'
  },
  title: {
    color: "white",
    fontSize: 30,
    fontWeight: "200",
    marginTop: 50,
    marginBottom: 30
  },
  card: {
    flex: 1,
    backgroundColor: 'white',
    width: width - 32,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    // platform specific style
    ...Platform.select({
      ios: {
        // for iOS
        shadowColor: "rgb(50, 50, 50)",
        shadowOpacity: 0.5,
        shadowRadius: 5,
        shadowOffset: {
          height: -1,
          width: 0
        }
      },
      android: {
        // for Android
        elevation: 3
      }
    })
  },
  input: {
    padding: 16,
    borderBottomColor: "#bbb",
    borderBottomWidth: 1,
    fontSize: 20
  },
  todos: {
    alignItems: "center"
  }
});
