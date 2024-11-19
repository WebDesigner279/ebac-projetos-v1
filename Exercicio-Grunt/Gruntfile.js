module.exports = function(grunt) {
  // Configuração das tarefas
  grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),

      // Configuração do LESS
      less: {
          development: {
              files: {
                  'css/style.css': 'less/style.less' // Destino:Origem
              }
          }
      },

      // Configuração do Uglify (compressão de JS)
      uglify: {
          build: {
              files: {
                  'js/script.min.js': ['js/script.js'] // Destino:Origem
              }
          }
      }
  });

  // Carregar os plugins
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Tarefas padrão
  grunt.registerTask('default', ['less', 'uglify']);
};
