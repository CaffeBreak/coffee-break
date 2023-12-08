// Type safe event emitter by https://qiita.com/YokoKen/items/8dee84625b6c9275e4c7

/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { EventEmitter as OriginalEventEmitter } from "events";

export class EventEmitter extends OriginalEventEmitter {
  public emit<T extends (...args: any[]) => void>(
    port: EventPort<T>,
    ...args: Parameters<T>
  ): boolean;
  public emit(name: string | symbol, ...args: any): boolean;
  public emit(event: any, ...args: any[]) {
    const name = event instanceof EventPort ? event.name : (event as string | symbol);
    return super.emit(name, ...args);
  }
}

/**
 * A port to deliver an event to listeners.
 */
export class EventPort<T extends (...args: any[]) => void> {
  /**
   * Initialize an instance of EventPort<T> class.
   * @param name The name of the event.
   * @param emitter An instance of EventEmitter class.
   */
  public constructor(name: string | symbol, emitter: EventEmitter) {
    this._name = name;
    this._emitter = emitter;
  }

  private readonly _name: string | symbol;
  private readonly _emitter: EventEmitter;

  /**
   * Gets the name of the event.
   */
  public get name() {
    return this._name;
  }

  /**
   * Adds a listener.
   * @param listener The listener to be added.
   */
  public on(listener: T) {
    this._emitter.on(this._name, listener);
  }

  /**
   * Adds a listener that will be called only once.
   * @param listener The listener to be added.
   */
  public once(listener: T) {
    this._emitter.once(this._name, listener);
  }

  /**
   * Removes a listener.
   * @param listener The listener to be removed.
   */
  public off(listener: T) {
    this._emitter.off(this._name, listener);
  }

  /**
   * Removes the all listeners.
   * @param listener
   */
  public removeAllListeners() {
    this._emitter.removeAllListeners(this._name);
  }
}
