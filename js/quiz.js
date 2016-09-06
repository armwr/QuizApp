(function(){

  angular
  .module('quizApp', [])
  .controller('QuizController', QuizController)

  function QuizController($scope, $http, $sce) {

    var vm = this;

    vm.selectAnswer = selectAnswer;
    vm.isSelected = isSelected; 
    vm.isCorrect = isCorrect; 
    vm.selectContinue = selectContinue;
    vm.createShareLinks = createShareLinks;



    $scope.score = 0;
    $scope.activeQuestion = -1;
    $scope.activeQuestionAnswered = 0;
    $scope.percentage = 0;

    $http.get('../mock/data.json').then(function(quizData) {
      $scope.myQuestions = quizData.data;
      $scope.totalQuestions = $scope.myQuestions.length;
    });

    function selectAnswer(qIndex, aIndex) {
      var questionState = $scope.myQuestions[qIndex].questionState;

      if( questionState != 'answered' ) {
        $scope.myQuestions[qIndex].selectedAnswer = aIndex;
        var correctAnswer = $scope.myQuestions[qIndex].correct;
        $scope.myQuestions[qIndex].correctAnswer = correctAnswer;

        if( aIndex === correctAnswer) {
          $scope.myQuestions[qIndex].correctness = 'correct';
          $scope.score += 1;
        } 
        else {
          $scope.myQuestions[qIndex].correctness = 'incorrect';
        }
        $scope.myQuestions[qIndex].questionState = 'answered';
      }
      $scope.percentage = (($scope.score / $scope.totalQuestions)*100).toFixed(2);
    }

    function isSelected(qIndex, aIndex) {
      return $scope.myQuestions[qIndex].selectedAnswer === aIndex;
    }

    function isCorrect(qIndex, aIndex) {
      return $scope.myQuestions[qIndex].correctAnswer === aIndex;
    }

    function selectContinue() {
      return $scope.activeQuestion += 1;
    }

    function createShareLinks(percentage) {

      var url = 'lysenko.pp.ua/saturnquiz';

      var emailLink = '<a class="btn email" href="mailto:?subject=Try to beat my saturn quiz score!&body=I scored a '+ percentage +'% on this quiz about Saturn. Try to beat my score at '+ url +'">Email a friend</a>';

      var twitterlLink = '<a class="btn twitter" target="_blank" href="http://twitter.com/share?text=I scored a '+ percentage +'%25 on this quiz about Saturn. Try to beat my score at&url='+url+'&hashtags=SaturnQuiz">Tweet your score</a>';

      var newMarkup = emailLink + twitterlLink;

      return $sce.trustAsHtml(newMarkup);
    }

  }

})();