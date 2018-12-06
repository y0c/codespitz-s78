# Interface

* ES6에서의 Iterator, Iterable 은 실체가 없고 정의만 되어져있다. 
* Javascript에서는 컴파일언어가 아니므로 약속만 지켜주면 된다. 
* 인터페이스가 정의할 수 있는 범위는 언어의 버전별 종류별로 다르다. 

```javascript
  function(arguments): returnType // 메소드를 정의했다면 Context에 대한 사용법도 같이 정의해줘야 한다. 
```

# Decorator 

* Undo 가 가능해짐 
* 기능을 덧붙여나가는 패턴 
* Command Pattern과 깊은관련이 있음 
* Interface를 통해서 동일한 메소드를 호출하고 반복적인 Decorator 호출을 통해 결과값을 도출한다. 
* 장점은 런타임시에 조립하는 순서대로 조합할 수 있음 


기본 본체가되는 Decorator와 보조 Decorator로 나뉘게 된다. 


# Observer 

* 권한을 축소해 줄 수 있다. -> 권한을 위임해 줄 수 있다. 
* 권한이 없을수록 Subject, 권한이 많다면 Observer 
* 권한관계를 재조정 할 수 있다. 

