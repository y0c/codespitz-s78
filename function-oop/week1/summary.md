# Code Spitz #1 
## Sub Routine Flow
* Flow - 메모리에 적재된 명령들 (한 번 올라간 것들은 취소하지 못함)
* Routine - 반복적으로 사용할 수 있는 Flow

Main Routine 과 Sub Routine 의 관계는 상대적인 개념 
보는 관점에 따라 달라짐 
ex) Class 상속 관계 OS 및 Application 

기본적으로 Sub Routine은 Main Flow로 실행 후 돌아오게 됨 
여기서, Main Flow 에서 Sub Routine의 결과가 돌아오는 Point가 있음 
실행하기전에 돌아올 Point도 미리 지정. 

*Routine은 Flow를  Main 에서 가져오게 됨*

ES6에서는 *Function* 키워드를 사용할 필요는 없음 
-> 순수 함수는 *this* 를 바인딩 할 필요가 없기 때문에 
만약, *this*를 사용하고자 한다면 *class*로 정의하여 *Method*를 만들 것 

## Communication with Routine 
Routine 끼리 통신할 때는 *argument*와 *return*을 사용함 (기본적으로) 
Sub Routine은 *return point*로 반환 

Javascript 는 모든 Routine이 *return* 이 존재 
대부분의 언어는 *return*이 존재하는 Routine과 *return*이 존재하지 않는 Routine으로 구분됨 

ex) VB의 *Function* *Procedure* 

`A = Routine(B) + Routine(C) + Routine(D)`

Routine(B) - Routine 실행 후에 값을 기억하고 있다는 의미 
즉 Routine의 실행결과는 메모리에 저장되어 있음 

-> 일반적인 Routine의 경우  Co-Routine이나 다른 Routine의 경우 달라짐 

## Sub Routine in Sub Routine 
위에 설명하듯이 Routine의 관계는 상대적 관계이다. 
Routine에서 Sub Routine을 호출시 현재 메모리에 *Keep* 하게 됨 
*Keep*을 하기 때문에 위 연산과 같은 덧셈이 가능. 

여기서 이 *Keep* 되는 부분을 `Call Stack` 이라고 부른다. 
Call Stack을 최적화 해나가는 과정 -> 꼬리 물기 최적화 
*Call Stack*이 기본적으로 정의된 size를 넘어갈때 
 *Stack Overflow* 


## Value vs Reference 
Value와 Reference는 언어가 지정함
 
Routine 간의 Communication을 할때 Value의 경우 
*Call By Value* 방식으로 호출이 되므로 복사본이 넘어감 
-> 의존성이 낮아짐 (관계가 없어짐)
-> State Safe
-> 순수한 함수(함수형 프로그래밍 에서 주로 사용) 

Routine간의 Communication을 Reference로 할경우 
*Call By Reference* 방식으로 호출 되므로 참조가 넘어감 

```javascript
const routine => ref => ['a','b'].reduce((p,c) => {
	delete p[c];
	return p;
},ref);

cosnt ref = { a:3, b:4, c:5, d:6 };
const a = routine(ref);

const routine => ref => ({a,b ...rest}) => rest
```
호출할때마다 결과가 다름 
-> 즉 , 순수하지 않은 함수 
-> 되도록 순수한 함수를 사용하고  eference를 건드리게 되면 프로그램을 예측하기 어렵고 Side effect가 생기기 때문에 이 참조는 건드리지 않고 *ReadOnly*로 사용하도록 하자

-> Return 할때도 마찬가지로 새로운 객체를 사용해서 사용하도록 함 
(Immutable)

> ES6 에서는 객체 리터럴에 순서를 보장해 줌 
> ` const routine = ref => ({ ...ref, e:7 }); `


## Structured Design 
`High Cohesign, Low Coupling`

### Coupling 
* Content
* Common - 전역 객체 참조 
* External - 외부 Data를 참조 
ex) Htttp API 통신
* Control - flag값에 의존적인 coupling 
ex) 잘못된 Factory Pattern 
Strategy Pattern으로 파훼
* Stamp - has - a 관계, 처리기 사용시 
데이터 범위가 클경우.. 즉 객체나 구조체같은걸로 Communication 하는경우 
* Data 
Data만으로 Communication 하는 경우 

### Cohesion 
* Concidential 
ex) util 클래스
* Logical 
도메인이 특수할 수록 사용하면 안됨 , 일반적일 수록 사용해도 됨 
* Temporal 
시간의 순서대로 실행 
```javascript
const App = class {
	init() {
		this.db.init();
		this.net.init();
		this.asset.init();
		this.ui.start();
	}
}
```
순서가 바뀔수 있으므로 위험 
* Procedural 
* Communicational 
상호보완적으로 역활분리 하여 처리
* Sequential
Procedural + Communicational 
ex) Builder Pattern 
* Functional 