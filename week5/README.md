# Code Spitz 4

## Value Context 
* immutable 방식 
* substr, concat, slice 와 같은 방식
* Number(3) , Number(3) 이면 메모리 주소는 다르지만 Value Context를 사용하므로 같다고 나옴(함수형 프로그래밍)
* Domain에 따라서 Value Context로 디자인 할 것인지 Reference Context로 디자인 할것인지 결정 
* isEqual을 구현해서 사용

## Reference Context
* mutable 방식
* new 를 통해서 다른 메모리 주소로 식별
* getter를 만들때는 Value값으로 스냅샷을 떠서 리턴해야한다. 그렇지않으면 타이밍에 의해서 런타임 에러가 일어날 확률이 높아짐

함수형에서 넘겨지는 인자는 항상 Value로 식별해야하고 객체지향에서는 참조로 객체를 식별해야 한다.
