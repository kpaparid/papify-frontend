package expo.modules.movefile

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.net.URL
import java.io.File

class MoveFileModule : Module() {
  // Each module class must implement the definition function. The definition consists of components
  // that describes the module's functionality and behavior.
  // See https://docs.expo.dev/modules/module-api for more details about available components.
  override fun definition() = ModuleDefinition {
    // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
    // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
    // The module will be accessible from `requireNativeModule('MoveFile')` in JavaScript.
    Name("MoveFile")

    // Sets constant properties on the module. Can take a dictionary or a closure that returns a dictionary.
    Constants(
      "PI" to Math.PI
    )

    // Defines event names that the module can send to JavaScript.
    Events("onChange")

    // Defines a JavaScript synchronous function that runs the native code on the JavaScript thread.
    Function("hello") {
      "Hello Papify GAMOTO! 👋"
    }

    AsyncFunction("moveFolders") { endPath: String, pathsToMove: List<String> ->
        val destination = File(endPath)

        if (destination.exists()) {
            destination.deleteRecursively() // Delete entire directory
        }
        destination.mkdirs() // Recreate it

        // Iterate through each path to move
        for (path in pathsToMove) {
          val source = File(path)
          if (source.exists()) {
            
            val newName = source.name.removePrefix("Copy_")
            val target = File(destination, newName)

            // Move the file or directory
            val moved = source.renameTo(target)

            if (!moved) {
              throw Exception("Failed to move ${source.absolutePath} to ${target.absolutePath}")
            }
          } else {
            throw Exception("Source path does not exist: $path")
          }
        }
    }

    // Defines a JavaScript function that always returns a Promise and whose native code
    // is by default dispatched on the different thread than the JavaScript runtime runs on.
    AsyncFunction("setValueAsync") { value: String ->
      // Send an event to JavaScript.
      sendEvent("onChange", mapOf(
        "value" to value
      ))
    }

    // Enables the module to be used as a native view. Definition components that are accepted as part of
    // the view definition: Prop, Events.
    View(MoveFileView::class) {
      // Defines a setter for the `url` prop.
      Prop("url") { view: MoveFileView, url: URL ->
        view.webView.loadUrl(url.toString())
      }
      // Defines an event that the view can send to JavaScript.
      Events("onLoad")
    }
  }
}
