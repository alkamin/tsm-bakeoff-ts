lazy val root = project.enablePlugins(ScalaJSPlugin)

lazy val client = project
  .in(file("scala-js"))
  .enablePlugins(ScalaJSPlugin)
  .settings(
    libraryDependencies ++= Seq(
      "com.softwaremill.sttp.client" %%% "core" % "2.2.9",
      "com.softwaremill.sttp.client" %%% "circe" % "2.2.9",
      "com.azavea.stac4s" %%% "core" % "0.0.19",
      "io.github.cquiroz" %%% "scala-java-time" % "2.0.0"
    )
  )
  .settings(
    scalaJSLinkerConfig ~= { _.withModuleKind(ModuleKind.CommonJSModule) }
  )
