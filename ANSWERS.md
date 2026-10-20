# Lab 08 Task 1 — Answers

### (a) Why can an interface not be an injection token?
In TypeScript, interfaces are purely compile-time type constructs that are completely erased during compilation into JavaScript (type erasure). Because injection tokens must exist at runtime so the NestJS Inversion of Control (IoC) container can look up and wire dependencies in its registry, interfaces cannot serve as tokens; runtime identifiers such as strings, Symbols, or classes must be used instead.

### (b) What does it mean that a provider is a singleton?
In NestJS, providers are singletons by default (application scope), meaning the IoC container instantiates only one single instance of the provider during application bootstrap. That single cached instance is shared across the entire application lifecycle and injected into every class that requests it.

### (c) What must you write so that OtherModule can use CoursesService?
In `CoursesModule`, you must include `CoursesService` in the `exports` array (`exports: [CoursesService]`). Then, in `OtherModule`, you must import `CoursesModule` in the `imports` array (`imports: [CoursesModule]`), which allows `CoursesService` to be injected into `OtherModule`'s controllers and services.
