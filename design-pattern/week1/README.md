# 코드스피츠 디자인패턴 #1

객체지향 설계
* 추상화 레벨을 먼저 고민
* API를 어떻게 사용할지를 먼저 설계

```javascript
const Table =(_ => {
	//static private
	//Symbol 을 이용해서 private 을 구현 
  //Scope 를 이용하지 않아도됨
	const Private = Symbol();

	return class {
		//constructor
		//public
		//private
	}

})
//API 사용하는 쪽을 먼저 구현 
const table = new Table('#data');
table.load('75_1.json')

```

> 변화율
> 해당부분의 코드가 변하는 이유 
> 시간적인 대칭성 
> “변화의 원인과 주기별로 정리”

> 역할이 변경될때 변화되는 정도 
> 수정되는 타이밍에 따라서 역할을 분리 

##  Function vs Method 
Method 는 상태에 의존적이고 상태를 변경시킨다. 
인자를 사용하는경우는 static function 을 사용하는 utility function 들이다. 
* Function - Global Context
* Method - Object Context 

“모든 프로그램은 변한다”

변화율에 대응하는 방법 -> 격리(isolation)

소프트웨어 공학의 상당 부분 -> 격리전략 
> “변화율에 따라 작성하기”

/*“High Cohesion Loose Coupling “*/

```javascript
const loader = new Loader("75_1.json");
loader.load(json=>{
	const renderer = new Renderer();
	//json을 셋팅하고 그리는것은 변화율이 다름 
	renderer.setData(json); // Value->Object
	renderer.render();

	const data = JsonData("75_1.json");
  renderer.render(data);
})
```

Data는 상위 클래스로서 공통적인 프로토콜을 통해 리턴하게되고 
하위클래스인  JsonData, XMLData, CSVData 는 hook method 를 구현해서 각자에 맞게 데이터를 파싱해서 리턴 
“Template Method Pattern”
-> 상속을 통한 확장 

### 도메인 모델 
Native 플랫폼 코드가 개입되지않은 코드 

```javascript
//Domain code
const Renderer = class{
	async render(data){
		if(!data instanceof Data)) throw 'invalid data type';
		this._info = await data.getData();
		this._render();
	}

	_render() {
		
	}
}

```


