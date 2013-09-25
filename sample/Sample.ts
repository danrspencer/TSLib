

module sample {

  module Namespace1 {

    module Namespace1a {

      import N2Class1 = sample.Namespace2.N2Class1;

      class N1aClass1 {

      }

      class N1aClass2 {

      }

    }

    module Namespace1b {

      class N1bClass1 {

      }

      class N1bClass2 {

      }

    }

  }

  export module Namespace2 {

    export class N2Class1 {

    }

    class N2Class2 {

    }


  }
}

var test = sample.Namespace2.N2Class1();