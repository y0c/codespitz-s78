# Code Spitz 4강 

## Visitor Pattern

* Loop 와 그안의 로직을 분리 ex) HOF(forEach, every, sum)
* Composite Pattern 은 Loop 와 그 안의 로직이 섞여있다. 
* Loop 안에 역할을 분리 할 수 있음 
* Loop 에 대한 추상화 작업
* 기본적으로 전략패턴에 기반을 두고 있다.
  * 반복적인구조에서 사용하는 전략객체를 Visitor라고 한다.  


## Template Method Pattern 을 통한 공통 로직 분리 

* hook간에 Context를 유지하기 위한 프로토콜이 필요 
  * 인자와 리턴 값을 통해서 유지 
  * this에 메모리공간을 통해서 유지 
* this Context를 사용하지 않음 그러므로 상속에 대한 이점이 없음 
* 추상 객체에 대한 지식이 많다면 Template Method 반대로 추상객체의 지식과는 별 관련이 없다면 Strategy Pattern을 통해서 구현한다. 
