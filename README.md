# knuOm4.github.io
Web Demo to MM Problems Solver
to explore go to http://knuOm4.github.io

TODO list:
<ul>
<li>Интерфейс</li>
  <ul>
    <li>Заточенный интерфейс (конкретизация и локальность вводимых данных начальных и граничных)</li>
    <li>Режим нормальной задачи и тестовой</li>
    <li>Ввод начальных наблюдений на графике и ручной ввод</li>
    <li>Красота во всех 3 частях</li>
  </ul>
<li>Внутренняя логика</li>
  <ul>
    <li>Список входных данных</li>
    <li>Алгоритм решения</li>
    <li>Пример выходных данных</li>
    <li>Обеспечить взаимосвязь дифф оператора и функции Грина</li>
    <li>Рисерч на тему поиска функции Грина для вводимого дифф уравнения</li>
    <li>Алгоритм оценивания задачи (аналитическое описание процесса и подобное)</li>
  </ul>
<li>График</li>
  <ul>
    <li>Вывод реального графика по примеру выходных данных 2-д</li>
    <li>График 3-мерный для дискретных временных точек (желательно интерактивный)</li>
    <li>3-мерный график для динамического времени (волновой эффект)</li>
    <li>Отображение "шума"</li>
  </ul>
</ul>

<h1>Входные данные</h1>
Основная суть прямой задачи - поиск функции состояний (у) по данному линейному дифф оператору, правой части, начальных, краевых условий и средне квадратичного критерия. Если есть какой то процесс и мы можем за ним наблюдать у нас будут реальные данные, так как такого мы не имеем, то мы можем легко моделировать задачи. По большей части мы будем работать с модельными (тестовыми) задачами, но по идее программа должна сработать и в реальных условиях.
Описание задач
Мы задаем дифф оператор (вписываем или выбираем, на данном этапе лучше выбирать) который мы динамически анализируем с помощью вольфрама (в дальнейшем) и по (формуле || заранее известной функцие || вычисленной с помощью вольфрама) имеем функцию Грина. В принципе нам Стоян выдавал формулу и того и того, но можем взять и попроще, к тому же для 1-мерного уравнения что то сам придумаем точно, функция грина - что то похожее на обобщенное решение. Следовательно наша работа будет происходить в 1-... 2-... 3-... а в идеале н-мерном пространстве (как измерение можно придумать ну что угодно). Под пространством всегда стоит понимать размерность + 1 потому что даже в простейшем случае будем рассматривать время.
у мы ищем, но в тестовой задаче мы его изначально и задаем (вписываем или выбираем) в рамках тестовой задачи записываем или решаем для него правую часть, в обычной задаче просто пишем или выбираем правую часть, на дальнейших этапах мы заываем что знаем точно что такое у.
Условия:
начальные условия задаются при нулевом времени (всегда) в какой то точке пространства S0 (насколько я понял) тут дифф оператор тождественная еденица, в тестовой задаче у нам известен, вводим точку из области и правая часть вычисляется сама, или вписываем вручную если обычная задача. тут R0 = 1; L0 = кол-во наблюдений
краевые условия задаются в области SГ (- не S0) (насколько я понял) тут дифф оператор тождественная еденица, в тестовой задаче у нам известен, вводим точку из области и правая часть вычисляется сама, или вписываем вручную если обычная задача. тут RГ = 1; LГ = кол-во наблюдений
Из того что нужно ввести кажется все, из того что стоит отобразить - нужно смотреть как получится.
Пожелания:
В самом начале можно задать область, ограничить чем то и вставлять как значения по умолчанию где подходит.
Ввод координат области можно и с помощью мышки конечно =)
<h1>Алгоритм</h1>
